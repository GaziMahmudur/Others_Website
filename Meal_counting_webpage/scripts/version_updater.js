const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// 1. Update package.json
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const oldVersion = pkg.version;
const parts = oldVersion.split('.');
parts[2] = parseInt(parts[2]) + 1;
const newVersion = parts.join('.');
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`Updated package.json: ${oldVersion} -> ${newVersion}`);

// 2. Update js/core.js (ROOT and WWW)
function updateCore(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/const APP_VERSION = '.*?';/, `const APP_VERSION = '${newVersion}';`);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${path.relative(rootDir, filePath)}`);
    }
}
updateCore(path.join(rootDir, 'js', 'core.js'));
updateCore(path.join(rootDir, 'www', 'js', 'core.js'));

// 3. Update android/app/build.gradle
const gradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');
if (fs.existsSync(gradlePath)) {
    let content = fs.readFileSync(gradlePath, 'utf8');
    
    // Increment versionCode
    content = content.replace(/versionCode (\d+)/, (match, code) => {
        const nextCode = parseInt(code) + 1;
        return `versionCode ${nextCode}`;
    });
    
    // Update versionName
    content = content.replace(/versionName ".*?"/, `versionName "${newVersion}"`);
    
    fs.writeFileSync(gradlePath, content);
    console.log(`Updated android/app/build.gradle`);
}
