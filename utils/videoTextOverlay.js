const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

exports.addTitlesToVideo = async (inputPath, outputPath, {title, subtitle, name, font = 'arial', titleSize = 48, subtitleSize = 36, color = 'white'}) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath)
      .videoFilters([
        // Title at extreme top (centered)
        {
          filter: 'drawtext',
          options: {
            text: title,
            fontfile: path.join(__dirname, 'fonts', `${font}.ttf`),
            fontsize: titleSize,
            fontcolor: color,
            x: '(w-text_w)/2', // Center horizontally
            y: 'h*0.05', // 5% from top
            shadowcolor: 'black',
            shadowx: 2,
            shadowy: 2,
            borderw: 1,
            bordercolor: 'black@0.5'
          }
        },
        // Subtitle below title (right aligned)
        {
          filter: 'drawtext',
          options: {
            text: `from ${name}`,
            fontfile: path.join(__dirname, 'fonts', `${font}.ttf`),
            fontsize: subtitleSize,
            fontcolor: color,
            x: 'w-text_w-20', // Right aligned with 20px margin
            y: `h*0.05+${titleSize}+10`, // Below title with padding
            shadowcolor: 'black',
            shadowx: 2,
            shadowy: 2,
            borderw: 1,
            bordercolor: 'black@0.5'
          }
        }
      ])
      .on('end', () => resolve(outputPath))
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      })
      .save(outputPath);
  });
};