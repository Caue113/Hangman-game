/** @type {String} */
let myStr = "aababaz";

/** @type {String} */
let tempStr = "";


//1st hide the true string

for (let i = 0; i < myStr.length; i++) {
    tempStr += "#";    
}



//2nd decode each letter per time of the string


/** @type {String}*/
let buildStr = "";


function replaceCharAt(typedChar)
{
    buildStr = "";
    
    for (let i = 0; i < myStr.length; i++) {
        char = myStr.charAt(i);
    
        if(typedChar == char)
            buildStr += myStr.substring(i, i + 1);
        else
            buildStr += tempStr.substring(i, i + 1);     
    }

    tempStr = buildStr;

    console.log(tempStr);
}



