import { FormGroup, Label } from '@adminjs/design-system';
import { useTranslation } from 'adminjs';
import React from 'react';
import File from './upload-file';

const Show = (props) => {
  const { property } = props;
  const { translateProperty } = useTranslation();
  return (
    <FormGroup>
      <Label>{translateProperty(property.label, property.resourceId)}</Label>
      <File width={property.custom.multiple ? 240 : '100%'} {...props} />
    </FormGroup>
  );
};

export default Show;
