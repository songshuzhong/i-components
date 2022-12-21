const scripts = {};

const appendScript = (assetName, type = 'script', source) => {
  const asset = source;
  const name = asset.replace(/(.*\/)*([^.]+).*/ig,'$2');
  if (scripts[name]) {
    return Promise.resolve(scripts[name]);
  }
  scripts[name] = new Promise(function(resolve, reject) {
    if (!asset) {
      scripts[name] = null;
      return reject({message: `资源${assetName}加载失败，请确认路径是否正确。`});
    }
    const script = document.createElement('script')
    script.id = `${name}_${new Date().getTime()}`;
    script.type = 'text/javascript';
    script.src = asset;
    script.onload = script.onreadystatechange = function() {
      if (
        !script.readyState ||
        script.readyState === 'loaded' ||
        script.readyState === 'complete'
      ) {
        script.onload = script.onreadystatechange = null;
        resolve();
      } else {
        scripts[name] = null;
        reject({
          message: `${name}加载失败。`
        });
      }

      script.onerror = function() {
        scripts[name] = null;
        reject();
      }
    }
    document.head.appendChild(script);
  });
  return scripts[name];
};

export {
  appendScript
};
