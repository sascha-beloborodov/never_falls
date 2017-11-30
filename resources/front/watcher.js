const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');

const startTime = new Date().getTime();

const changeFilesName = () => {
    const jsPath = '../../public/front/static/js';
    const cssPath = '../../public/front/static/css';
    fs.readdir(jsPath, (err, files) => {
        files.forEach((val, idx) => {
            if (-1 != val.indexOf('.js') && -1 == val.indexOf('.js.map')) {
                fs.rename(`${jsPath}/${val}`, `${jsPath}/main.js`, (err) => {
                    if (error) {
                        console.error(err);
                    }
                });
            }
        });
    });
    fs.readdir(cssPath, (err, files) => {
        files.forEach((val, idx) => {
            if (-1 != val.indexOf('.css') && -1 == val.indexOf('.css.map')) {
                fs.rename(`${cssPath}/${val}`, `${cssPath}/main.css`, (err) => {
                    if (error) {
                        console.error(err);
                    }
                });
            }
        });
    });
}

const copy = (src, dest) => {
	const oldFile = fs.createReadStream(src);
    const newFile = fs.createWriteStream(dest);
    oldFile.pipe(newFile);
    // util.pump(oldFile, newFile);
    oldFile.on("end", function() {
        setTimeout(() => {
            changeFilesName();

        }, 1000);
        console.log( ( (new Date().getTime()) - startTime) / 1000  + ' seconds');
        console.log('Copying success');
    });
};

const mkdir = (dir) => {
	try {
		fs.mkdirSync(dir, 0755);
	} catch(e) {
		if(e.code != "EEXIST") {
			throw e;
		}
    }
};


const copyDir = (src, dest) => {
	mkdir(dest);
	const files = fs.readdirSync(src);
	for(let i = 0; i < files.length; i++) {
		const current = fs.lstatSync(path.join(src, files[i]));
		if(current.isDirectory()) {
			copyDir(path.join(src, files[i]), path.join(dest, files[i]));
		} else if(current.isSymbolicLink()) {
			const symlink = fs.readlinkSync(path.join(src, files[i]));
			fs.symlinkSync(symlink, path.join(dest, files[i]));
		} else {
			copy(path.join(src, files[i]), path.join(dest, files[i]));
		}
	}
};

fs.watch('src', (eventType, filename) => {
    if (-1 == ['change', 'rename'].indexOf(eventType)) {
        console.log('Unsupported event: ' + eventType);
        return;
    }
    console.log(filename);
    console.log(eventType);
    console.log('Start building...');
    exec('npm run build', (err, stdout, stderr) => {
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        if (err) {
          console.log('Node couldnt run build');
          return;
        }
        if (stdout) {
            console.log(`stdout: ${stdout}`);
        }
        console.log('Start Copying...');
        copyDir('build', '../../public/front');
        // fs.copyFileSync(, (err) => {
        //     if (err) {
        //       console.error(err);
        //     } else {
        //       console.log("Success.");
        //     }
        // });        
    });
});