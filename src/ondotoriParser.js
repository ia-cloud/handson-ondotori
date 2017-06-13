const parse = xml => Promise.resolve({
  contentType: 'iaCloudData',
  contentData: [{
    dataName: 'temperature',
    unit: '℃',
    // dig a required property
    dataValue: xml.venture.company[0].name[0],
  }],
});

export default parse;
