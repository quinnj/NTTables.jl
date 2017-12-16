import React from 'react';

import numeric from "./images/numeric.svg"
import alphabetical from "./images/alphabetical.svg"
import calendar from "./images/calendar.svg"
import computed from "./images/computed.svg"
import dots from "./images/google-circle-communities.svg"

export default function DataTypeIcon({ icon }) {
    let src = null
    if (icon === "REAL") {
        src = numeric
    } else if (icon === "TEXT") {
        src = alphabetical
    } else if (icon === "DATE") {
        src = calendar
    } else if (icon === "COMPUTED") {
        src = computed
    } else {
        src = dots
    }
    return <img className="DataTypeIcon" src={src} />
}