__precompile__(true)
module Peg

using HTTP, JSON2, Reexport

@reexport using DataStreams
@reexport using Dates

JSON2.write(io::IO, ::Missing) = write(io, "null")

const DATAPATH = string(@__DIR__, "/../app/data")

icontype(::Type{Union{T, Missing}}) where {T} = icontype(T)
icontype(::Type{T}) where {T <: AbstractString} = "TEXT"
icontype(::Type{T}) where {T <: Real} = "REAL"
icontype(::Type{T}) where {T <: Dates.TimeType} = "DATE"
icontype(::Type{Any}) = "OTHER"
icontype(x) = "OTHER"

mutable struct View
    index::Int
    name::String
    hide::Bool
    preCode::String
    sourceCode::String
    generatedQuery::String
    cacheSource::Bool
    sortSearch::String
    columnSearch::String
    columns::Vector{NamedTuple}
    limit::Union{Void,Int}
    offset::Union{Void,Int}
end

const DEFAULT_VIEW = View(0, "view_0", false, "", "(a=[1,2,3,1], b=[\"hey\", \"ho\", \"neighbor\", \"hi\"], c=[4.0, 5.0, 6.6, 6.0], d=[missing,0,0,0], new_col=[2,2,2,2], new_col2=[3,4,4,4])", "", true, "", "", [], 500, 0)

function generateQuery(view)
    columns = view.columns
    actions = :([])
    foreach(columns) do col
        if !get(col, :unselected, false)
            expr = :(())
            get(col, :group, false) && push!(expr.args, :(group=true))
            !isempty(get(col, :aggregate, "")) && push!(expr.args, :(aggregate=$(Meta.parse(col.aggregate))))
            if get(col, :sort, false)
                push!(expr.args, :(sort=true))
                push!(expr.args, :(sortasc=$(col.sortasc)))
                push!(expr.args, :(sortindex=$(col.sortidx)))
            end
            !isempty(get(col, :filter, "")) && push!(expr.args, :(filter=$(Meta.parse(col.filter))))
            !isempty(get(col, :having, "")) && push!(expr.args, :(having=$(Meta.parse(col.having))))
            if !isempty(get(col, :compute, ""))
                push!(expr.args, :(name=$(QuoteNode(Symbol(col.name)))))
                push!(expr.args, :(computeargs=$(Tuple(col.computeargs))))
                if col.aggregated
                    push!(expr.args, :(computeaggregate=$(Meta.parse(col.computeaggregate))))
                else
                    push!(expr.args, :(compute=$(Meta.parse(col.compute))))
                end
            else
                push!(expr.args, :(col=$(col.col)))
                push!(expr.args, :(name=$(QuoteNode(Symbol(col.name)))))
            end
            push!(actions.args, expr)
        end
    end
    source = view.cacheSource && haskey(SOURCES, view.index) ? SOURCES[view.index] : Meta.parse(view.sourceCode)
    q = :(Data.query($source, $actions, NamedTuple; limit=$(view.limit), offset=$(view.offset)))
    @show q
    return q
end

function queryHandler(req, resp)
    # parse request body into structure
    view = JSON2.read(String(req), View)
    # generate query
    query = generateQuery(view)
    view.generatedQuery = string(query)
    # return result
    res = @eval Main $query
    sch = Data.schema(res)
    rows, cols = size(sch)
    names = Data.header(sch)
    types = Data.types(sch)
    columnNames = Dict(x.name=>i for (i, x) in enumerate(view.columns))
    foreach(1:cols) do i
        col = columnNames[names[i]]
        view.columns[col] = merge(view.columns[col], (name=names[i], T=types[i], icon=icontype(types[i]), data=res[i]))
    end
    json = JSON2.write(view)
    resp = HTTP.Response(200, json)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    open(joinpath(DATAPATH, view.name), "w+") do f
        write(f, json)
    end
    return resp
end

function preSourceHandler(req, resp)
    view = JSON2.read(String(req), View)
    code = Meta.parse(view.preCode)
    @show code
    @eval Main $code
    resp = HTTP.Response(200)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp
end

const SOURCES = Dict()

function sourceHandler(req, resp)
    view = JSON2.read(String(req), View)
    source = "Data.stream!($(view.sourceCode), NamedTuple)"
    code = Meta.parse(source)
    view.generatedQuery = view.sourceCode
    res = @eval Main $code
    sch = Data.schema(res)
    rows, cols = size(sch)
    names = Data.header(sch)
    types = Data.types(sch)
    empty!(view.columns)
    foreach(1:cols) do i
        push!(view.columns, (col=i, origname=names[i], name=names[i], T=types[i], icon=icontype(types[i]), data=res[i], filter=""))
    end
    json = JSON2.write(view)
    resp = HTTP.Response(200, json)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    if view.cacheSource
        SOURCES[view.index] = res
    end
    open(joinpath(DATAPATH, view.name), "w+") do f
        write(f, json)
    end
    return resp
end

function initialize()
    # walk /data dir, JSON2.read each view, sort by index
    views = [JSON2.read(read(joinpath(DATAPATH, x), String), View) for x in readdir(DATAPATH)]
    sort!(views, by=x->x.index)
    if isempty(views)
        push!(views, DEFAULT_VIEW)
    end
    return views
end

function initialRequest(req, resp)
    resp = HTTP.Response(200, JSON2.write(initialize()))
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp
end

function run()
    r = HTTP.Router()
    HTTP.register!(r, HTTP.GET, "/initialize", initialRequest)
    HTTP.register!(r, HTTP.POST, "/presource", preSourceHandler)
    HTTP.register!(r, HTTP.POST, "/source", sourceHandler)
    HTTP.register!(r, HTTP.POST, "/query", queryHandler)
    HTTP.serve(port=8083, handler=r)
end

end # module
