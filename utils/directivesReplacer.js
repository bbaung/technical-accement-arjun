const customDirectives = {
    '@@beforeScript;': '<script defer src="/js/before.js"></script>'
}

const directivesReplacer = (string) => {
    let updateString = string

    Object.keys(customDirectives).map(directiveKey => {
        const directiveValue = customDirectives[directiveKey]        
        updateString = updateString.replaceAll(directiveKey, directiveValue)
    })
    
    return updateString
}

module.exports = directivesReplacer