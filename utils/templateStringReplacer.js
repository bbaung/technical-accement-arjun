const customDirectives = [
    {      
        title: "Transformer @beforeScript ",
        transform: (string) => string.replaceAll(`@@beforeScript;`, `<script defer src="/js/before.js"></script>`) 
    },
    {
        title: "Transformer @@public ",        
        transform: (string) => {      
            let updatedString = string;
            const regex = new RegExp(/@@public\(["'](?<file_path>[^"']+)["']\);/g);

            const matches = updatedString.matchAll(regex)

            for (const match of matches) {
                console.log("[MATCH]",match)
                updatedString = updatedString.replaceAll(match[0], match[1])   
            }            

            return updatedString
        },        
    }
]

const directivesReplacer = (string) => {
    let updateString = string

    customDirectives.map(directive => {        
        updateString = directive.transform(updateString)
    })
    
    return updateString
}

module.exports = directivesReplacer