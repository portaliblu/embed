const { execSync } = require('child_process')
const process = require('process')
const path = require('path')

const fs = require('fs-extra')
const replaceInFiles = require('replace-in-files')

const exec = (cmd) => execSync(cmd, { stdio: 'inherit' })
const tmpDir = './tmp'

const repoPathMatch = `${process.env.REPO}`.match(/.com:(.*)\.git$/)
const repoPath = repoPathMatch && repoPathMatch[1]

;(async function main() {
  const tmpDemoDir = `${tmpDir}/demo-html`
  fs.removeSync(tmpDir)
  fs.ensureDirSync(tmpDir)
  fs.copySync('./packages/demo-html/public', `${tmpDemoDir}/public`)

  process.chdir(tmpDemoDir)

  fs.ensureDirSync('./demo/')

  const files = fs.readdirSync('./public')

  const demoNames = []

  files.forEach((file) => {
    const filePath = `./public/${file}`
    const isFile = fs.lstatSync(filePath).isFile()
    if (isFile) {
      const title = path.basename(file, '.html')
      const dir = `./demo/${title}`

      fs.copySync(filePath, `${dir}/demo.html`)
      fs.writeFileSync(
        `${dir}/demo.details`,
        `---
   name: Embed - ${title}
   description: Original demo at https://github.com/Typeform/embed/tree/main/packages/demo-html/public/${file}`
      )

      demoNames.push(title)
    }
  })

  fs.writeFileSync(
    `README.md`,
    `# JSFiddle demos
    
Demo repository for [@typeform/embed](https://github.com/Typeform/embed) repository.

Links:

${demoNames
  .map(
    (name, index) =>
      `${index + 1}. [${name}](https://jsfiddle.net/gh/get/library/pure/${repoPath}/tree/master/demo/${name})`
  )
  .join('\n')}`
  )

  fs.removeSync('./public')

  const demoFiles = './**/*.html'

  await replaceInFiles({
    files: demoFiles,
    from: /\.+\/lib\/embed-next\.js/,
    to: '//embed.typeform.com/next/embed.js',
  })

  await replaceInFiles({
    files: demoFiles,
    from: /\.+\/lib\/css\//,
    to: '//embed.typeform.com/next/css/',
  })

  exec('git init')
  exec('git add .')
  exec('git commit -m demo')
  exec(`git remote add origin ${process.env.REPO}`)
  exec('git push origin master --force')

  process.chdir('../..')
  fs.removeSync(tmpDir)
})()
