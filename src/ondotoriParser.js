const parse = xml => Promise.resolve({
  contentType: 'iaCloudData',
  contentData: [{
    dataName: 'temperature',
    unit: '℃',
    // dig a required property
    dataValue: xml.root.device[0].temperature[0],
  }],
});

export default parse;
