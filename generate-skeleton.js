import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import glob from 'fast-glob'

const baseImagePath = path.dirname(fileURLToPath(import.meta.url));
const repoPath = path.join(baseImagePath, '..');
const skeleton = path.join(baseImagePath, './skeleton/');

async function main () {
    console.log('creating project dependency definition skeleton');

    const packageFile = JSON.parse(await fs.readFile(path.join(repoPath, './package.json')));

    // Root directory
    await fs.mkdir(skeleton);
    await fs.cp(path.join(repoPath, 'package.json'), path.join(skeleton, 'package.json'));
    await fs.cp(path.join(repoPath, 'package-lock.json'), path.join(skeleton, 'package-lock.json'));
    await fs.cp(path.join(repoPath, '.npmrc'), path.join(skeleton, '.npmrc'));

    for (let i = 0; i < packageFile.workspaces.length; i++) {
        const workspacePackageFile = path.join(repoPath, packageFile.workspaces[i], 'package.json');
        const packageFileList = await glob(workspacePackageFile);
        // Create directories
        const newDirs = packageFileList.map((packageFile) => {
            const baseDir = path.dirname(packageFile).replace(repoPath, '');
            return path.join(skeleton, baseDir);
        });
        await Promise.all(newDirs.map((dir) => fs.mkdir(dir, { recursive: true })));
        // Load package files, strip scripts
        const strippedPackageFiles = await Promise.all(packageFileList.map((packageFile, index) => {
            return (async () => {
                const json = JSON.parse(await fs.readFile(packageFile, 'utf-8'));
                delete json.scripts;
                return json;
            })();
        }));
        await Promise.all(strippedPackageFiles.map((packageFile, index) =>
            fs.writeFile(`${newDirs[index]}/package.json`, JSON.stringify(packageFile))));
        // Lockfiles
        await Promise.all(packageFileList.map((packageFile, index) =>
            fs.cp(path.join(path.dirname(packageFile), 'package-lock.json'), `${newDirs[index]}/package-lock.json`)
            // Catch for possibility of no lockfile
            .catch((err) => console.log(err))));
    }
    process.exit(0);
}

main().catch((err) => console.log(err));
