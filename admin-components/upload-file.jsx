// @adminjs/upload-ის File კომპონენტის ჩანაცვლება.
// ორიგინალი multiple ველზე mimeType[index]-ს კითხულობს და mimeType სვეტის გარეშე კრაშავს
// ("Cannot read properties of undefined (reading '0')"). აქ ტიპს ფაილის გაფართოებით ვარკვევთ.
import { Box, Button, Icon } from '@adminjs/design-system';
import { flat } from 'adminjs';
import React from 'react';

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

const SingleFile = ({ path, width }) => {
  if (!path) return null;
  if (IMAGE_EXT.test(path)) {
    return (
      <img
        src={path}
        alt=""
        style={{ maxHeight: width, maxWidth: width, marginRight: 8, marginBottom: 8 }}
      />
    );
  }
  if (VIDEO_EXT.test(path)) {
    return (
      <video
        src={path}
        controls
        style={{ maxHeight: width, maxWidth: width, marginRight: 8, marginBottom: 8 }}
      />
    );
  }
  return (
    <Box mb="default">
      <Button as="a" href={path} size="sm" rounded target="_blank">
        <Icon icon="Download" color="white" mr="default" />
        {path.split('/').pop()}
      </Button>
    </Box>
  );
};

const File = ({ width, record, property }) => {
  const { custom } = property;
  const value = flat.get(record?.params, custom.filePathProperty);
  const paths = (Array.isArray(value) ? value : [value]).filter(Boolean);
  if (!paths.length) return null;

  return (
    <Box flex flexWrap="wrap" alignItems="flex-start">
      {paths.map((path, index) => (
        <SingleFile key={`${path}-${index}`} path={path} width={width} />
      ))}
    </Box>
  );
};

export default File;
