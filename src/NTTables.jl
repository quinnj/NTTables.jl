module NTTables

using Nulls

const Table = NamedTuple{names, T} where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}

Base.size(tbl::Table) = (length(tbl) == 0 ? 0 : length(getfield(tbl, 1)), length(tbl))
function Base.size(tbl::Table, i)
    r, c = size(tbl)
    return ifelse(i == 1, r, ifelse(i == 2, c, 0))
end

# row iteration
Base.start(tbl::Table) = 1
@generated function Base.next(tbl::NamedTuple{names, T}, row) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    NT = NamedTuple{names}
    S = Tuple{map(eltype, T.parameters)...}
    r = :(Base.namedtuple($NT, convert($S, tuple($((:($(Symbol("v$i")) = getfield(tbl, $i)[row]; $(Symbol("v$i")) isa Null ? null : $(Symbol("v$i"))) for i = 1:nfields(T))...)))...))
    return :($r, row + 1)
end
Base.done(tbl::Table, i) = i > size(tbl, 1)

# getindex
# tbl[tbl.col1 .== "hey"]
@generated function Base.getindex(tbl::NamedTuple{names, T}, bools::AbstractVector{Bool}) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    NT = NamedTuple{names}
    r = :(Base.namedtuple($NT, convert($T, tuple($((:(getfield(tbl, $i)[bools]) for i = 1:nfields(T))...)))...))
    return r
end
# tbl[x->x.col1 == "hey"] # filter table, pass function that gets applied to each row (as NamedTuple) & returns Bool
function Base.getindex(tbl::Table, f::Function)
    r, c = size(tbl)
    bools = falses(r)
    for (i, row) in enumerate(tbl)
        bools[i] = f(row)
    end
    return tbl[bools]
end

function Base.getindex(tbl::NamedTuple{names, T}, ::Colon, bools::AbstractVector{Bool}) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    NT = NamedTuple{names[bools]}
    return Base.namedtuple(NT, (tbl[i] for i = 1:nfields(T) if bools[i])...)
end
# tbl[:, c->c in (:col1, :col2, :col3)]
# tbl[:, c->startswith(string(c), "col")]
function Base.getindex(tbl::NamedTuple{names, T}, ::Colon, f::Function) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    bools = falses(length(names))
    for (i, nm) in enumerate(names)
        bools[i] = f(nm)
    end
    return tbl[:, bools]
end

# tbl[:, 1]
# tbl[:, 1:3]
Base.getindex(tbl::Table, ::Colon, i::Integer) = getfield(tbl, i)
Base.getindex(tbl::Table, ::Colon, r::Range) = getfield(tbl, r)
function Base.getindex(tbl::Table, row::Integer, ::Colon) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    return next(tbl, row)[1]
end
# tbl[1:3, :]
# tbl[1, :]
function Base.getindex(tbl::NamedTuple{names, T}, r::Range, ::Colon) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    NT = NamedTuple{names}
    r = :(Base.namedtuple($NT, convert($T, tuple($((:(getfield(tbl, $i)[r]) for i = 1:nfields(T))...)))...))
    return r
end
function Base.getindex(tbl::NamedTuple{names, T}, r::AbstractVector{<:Integer}, ::Colon) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    NT = NamedTuple{names}
    r = :(Base.namedtuple($NT, convert($T, tuple($((:(getfield(tbl, $i)[r]) for i = 1:nfields(T))...)))...))
    return r
end

# setindex!
# tbl[tbl.col1 .== 1] = 2

# tbl[x->x.col1 == 1]

# tbl[:, ]

# push!, append!, deleteat!
@generated function Base.push!(tbl::NamedTuple{names, T}, nt::NamedTuple) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    NT = NamedTuple{names}
    r = :(Base.namedtuple($NT, convert($T, tuple($((:(push!(getfield(tbl, $i), nt[$i])) for i = 1:nfields(T))...)))...))
    return r
end
@generated function Base.append!(tbl::NamedTuple{names, T}, nt::NamedTuple{names, T}) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    NT = NamedTuple{names}
    r = :(Base.namedtuple($NT, convert($T, tuple($((:(append!(getfield(tbl, $i), nt[$i])) for i = 1:nfields(T))...)))...))
    return r
end
@generated function Base.deleteat!(tbl::NamedTuple{names, T}, inds) where {names, T <: NTuple{N, AbstractVector{S} where S}} where {N}
    NT = NamedTuple{names}
    r = :(Base.namedtuple($NT, convert($T, tuple($((:(deleteat!(getfield(tbl, $i), $inds)) for i = 1:nfields(T))...)))...))
    return r
end

# sort/sort!
# sort(tbl; col1=asc, col2=asc, col3=desc)
# sort(tbl; )

# -(;tbl..., newcol = tbl.col1 .+ tbl.col2)
# just works

# -by(tbl, )
# -pivot/unpivot
# -convert between CTable & RTable
# -"stacker"?
# -nicer show method

end # module
