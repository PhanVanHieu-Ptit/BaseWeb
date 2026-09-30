import type { UsersParams } from '../types'

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params: UsersParams) => [...usersKeys.lists(), params] as const,
}
