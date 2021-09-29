const { execSync } = require('child_process')
const process = require('process')

const fs = require('fs-extra')
const replaceInFiles = require('replace-in-files')

const exec = (cmd) => execSync(cmd, { stdio: 'inherit' })
const tmpDir = './tmp'

;(async function main() {
  const tmpDemoDir = `${tmpDir}/demo-html`
  fs.removeSync(tmpDir)
  fs.ensureDirSync(tmpDir)
  fs.copySync('./packages/demo-html', tmpDemoDir)

  process.chdir(tmpDemoDir)

  fs.removeSync('./package.json')
  fs.removeSync('./node_modules')
  fs.removeSync('./public/lib')
  fs.copySync('./public/', './')

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
  exec('git commit -m glitch')
  exec(`git remote add origin ${process.env.GLITCH}`)
  exec('git push origin master --force')
})()
