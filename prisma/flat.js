const fs = require('fs');
const path = require('path');

// 定义 flattenData 函数
function flattenData(data) {
  const result = [];

  function recurse(items, parentId = null) {
    for (const item of items) {
      const { children, ...rest } = item;
      result.push({ ...rest, parentId });

      if (children && children.length > 0) {
        recurse(children, item.id);
      }
    }
  }

  recurse(data);
  return result;
}

// 读取 data.json 文件
const dataFilePath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

// 处理数据
const flattenedData = flattenData(data);

// 导出到 flat.json 文件
const outputFilePath = path.join(__dirname, 'flat.json');
fs.writeFileSync(
  outputFilePath,
  JSON.stringify(flattenedData, null, 2),
  'utf-8',
);

console.log('Data has been flattened and saved to flat.json');
