import * as core from '@actions/core'
import * as fs from 'node:fs/promises';

async function run(): Promise<void> {
    try {
        const prepend: string = core.getInput('prepend')
        const append: string = core.getInput('append')
        const filename: string = core.getInput('filename')
        const filelocation: string = core.getInput('filelocation')
        const allowFeatureBranches: boolean = core.getBooleanInput('allow_feature_branches')

        const fileContents = await readFile(filename, filelocation)

        const versionString = findVersionLine(fileContents, prepend, append)

        if(versionString.includes("-") && !allowFeatureBranches){
            throw Error("This version file seems to contain a feature branch, Not allowed")
        }

        core.setOutput('version', versionString)
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

export function findVersionLine(content: string, prepend:string, append:string){
    const contentLines = content.split("\n")
    const versionline = contentLines.find(line => line.includes(prepend))

    if(versionline == undefined){
        throw Error("Could not find line that contains: " +prepend)
    }
    const version = versionline.split(prepend)[1].split(append)[0]
    return version

    
}

async function readFile(filename:string, filelocation:string): Promise<string>{
    const file:string = filelocation+filename
    const content = await fs.readFile(file, { encoding: "utf8" })
    return content
    
}

run()