const colorMapper = (colors) => {
    let result = {};

    colors.forEach(function(color) {
        result[''+color.slug+''] = color.color;
    });

    return result;
}

module.exports = colorMapper