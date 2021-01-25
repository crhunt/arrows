function binaryPredicateOutline (start, end, arrowWidth) {
    var shaftRadius = arrowWidth / 2;
    var headRadius = arrowWidth * 2;
    var headLength = headRadius * 2;
    var shoulder = start < end ? end - headLength : end + headLength;
    var boxStart = start < end ? start + (end-start) / 4 - headLength : end + (start-end) / 4 - headLength; // CRH
    var boxEnd = start < end ? start + 3 * (end-start) / 4 : end + 3 * (start-end) / 4; // CRH
    var boxMiddle = boxStart < boxEnd ? boxStart + (boxEnd-boxStart) / 2 - arrowWidth/2 : boxEnd + (boxEnd-boxStart) / 2 + arrowWidth/2; // CRH
    var boxHeight = headRadius * 2;
    return {
        outline: [
            // Front arrow
            //"M", start, shaftRadius,
            "M", boxEnd, shaftRadius,
            "L", shoulder, shaftRadius,
            "L", shoulder, headRadius,
            "L", end, 0,
            "L", shoulder, -headRadius,
            "L", shoulder, -shaftRadius,
            //"L", start, -shaftRadius,
            "L", boxEnd, -shaftRadius,
            // Back arrow
            "M", boxStart, shaftRadius,
            "L", start, shaftRadius,
            "L", start, -shaftRadius,
            "L", boxStart, -shaftRadius,
            // ORM predicate double box CRH
            // -- Start vertical line
            "M", boxStart, -boxHeight,
            "L", boxStart, boxHeight,
            "L", boxStart+arrowWidth, boxHeight,
            "L", boxStart+arrowWidth, -boxHeight,
            // -- Top horizontal line
            "M", boxStart+arrowWidth, boxHeight,
            "L", boxEnd-arrowWidth, boxHeight,
            "L", boxEnd-arrowWidth, boxHeight-arrowWidth,
            "L", boxStart+arrowWidth, boxHeight-arrowWidth,
            // -- Bottom horizontal line
            "M", boxEnd-arrowWidth, -boxHeight,
            "L", boxStart+arrowWidth, -boxHeight,
            "L", boxStart+arrowWidth, -boxHeight+arrowWidth,
            "L", boxEnd-arrowWidth, -boxHeight+arrowWidth,
            // -- End vertical line
            "M", boxEnd-arrowWidth, -boxHeight,
            "L", boxEnd-arrowWidth, boxHeight,
            "L", boxEnd, boxHeight,
            "L", boxEnd, -boxHeight,
            // -- Middle line
            "M", boxMiddle, -boxHeight,
            "L", boxMiddle, boxHeight,
            "L", boxMiddle+arrowWidth, boxHeight,
            "L", boxMiddle+arrowWidth, -boxHeight,
            // End ORM predicate double box CRH
            "Z"
        ].join(" "),
        apex: {
            x: start + (shoulder - start) / 2,
            y: 0
        }
    };
}

function subtypeOutline(start, end, arrowWidth) {
    var shaftRadius = arrowWidth / 2;
    var headRadius = arrowWidth * 2;
    var headLength = headRadius * 2;
    var shoulder = start < end ? end - headLength : end + headLength;
    return {
        outline: [
            "M", start, shaftRadius,
            "L", shoulder, shaftRadius,
            "L", shoulder, headRadius,
            "L", end, 0,
            "L", shoulder, -headRadius,
            "L", shoulder, -shaftRadius,
            "L", start, -shaftRadius,
            "Z"
        ].join(" "),
        apex: {
            x: start + (shoulder - start) / 2,
            y: 0
        }
    };
};
