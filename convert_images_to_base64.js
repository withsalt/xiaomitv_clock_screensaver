const fs = require('fs');
const path = require('path');

// 图片文件夹路径
const imagesDir = path.join(__dirname, 'images');

// 读取images文件夹中的所有文件
fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('读取图片文件夹失败:', err);
    return;
  }

  // 过滤出图片文件
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext);
  });

  console.log(`找到 ${imageFiles.length} 个图片文件`);

  // 为每个图片文件生成base64编码
  const base64Data = {};
  
  imageFiles.forEach(file => {
    const filePath = path.join(imagesDir, file);
    const fileName = path.basename(file, path.extname(file)); // 不带扩展名的文件名
    
    try {
      // 读取图片文件
      const imageBuffer = fs.readFileSync(filePath);
      
      // 获取文件扩展名来确定MIME类型
      const ext = path.extname(file).toLowerCase();
      let mimeType = 'image/png'; // 默认
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          mimeType = 'image/jpeg';
          break;
        case '.png':
          mimeType = 'image/png';
          break;
        case '.gif':
          mimeType = 'image/gif';
          break;
        case '.svg':
          mimeType = 'image/svg+xml';
          break;
      }
      
      // 转换为base64
      const base64String = imageBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64String}`;
      
      base64Data[fileName] = dataUrl;
      
      console.log(`✓ ${file} 转换完成`);
    } catch (error) {
      console.error(`✗ ${file} 转换失败:`, error.message);
    }
  });

  // 生成HTML代码片段
  let htmlSnippet = '\n<!-- Base64编码的图片数据 -->\n';
  htmlSnippet += '<script>\n';
  htmlSnippet += '// 图片Base64数据\n';
  htmlSnippet += 'const imagesBase64 = {\n';
  
  Object.keys(base64Data).forEach((key, index) => {
    const comma = index < Object.keys(base64Data).length - 1 ? ',' : '';
    htmlSnippet += `  "${key}": "${base64Data[key].substring(0, 50)}..."${comma}\n`;
  });
  
  htmlSnippet += '};\n';
  htmlSnippet += '</script>\n';

  // 保存完整的base64数据到单独的文件
  const base64Json = JSON.stringify(base64Data, null, 2);
  fs.writeFileSync('images_base64.json', base64Json);
  
  console.log('\n✓ 所有图片转换完成!');
  console.log('✓ Base64数据已保存到 images_base64.json');
  console.log('\nHTML代码片段:');
  console.log(htmlSnippet);
});