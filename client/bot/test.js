import readline from 'readline'
import mind from './mind.js'

const reply = mind({ username: 'tobias' })

const que = () => {
    const inter = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    inter.question('Write:', message => {
        console.log(reply({ sender: 'mats', message }))
        inter.close();
        if (message !== 'exit') que()
    })
}

que()