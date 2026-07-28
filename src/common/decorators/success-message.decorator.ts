import { SetMetadata } from '@nestjs/common';

import { SUCCESS_MESSAGE_METADATA } from '@common/constants/metadata.constant';

export const SuccessMessage = (message: string) =>
  SetMetadata(SUCCESS_MESSAGE_METADATA, message);