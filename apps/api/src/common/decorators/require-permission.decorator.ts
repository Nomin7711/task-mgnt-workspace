import { SetMetadata } from '@nestjs/common';

// Define the key used to store and retrieve permissions from metadata
export const PERMISSION_KEY = 'permissions';

/**
 * Custom decorator used to specify the list of permissions required to access a route.
 * @param permissions A list of permission strings (e.g., 'task:create', 'user:manage').
 */
export const RequirePermission = (...permissions: string[]) => 
  SetMetadata(PERMISSION_KEY, permissions);