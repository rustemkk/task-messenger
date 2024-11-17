import { useMutation, useQuery, useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createMessage, getAccountById, getAccounts, getMe, getMessages } from './api';
import { MESSAGES_PAGINATION_SIZE } from '../../constants';

export const useLocalStorage = (key = '') => {
  const setItem = (value: any) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.log(error);
    }
  };

  return { setItem, getItem };
};

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(),
  });
};

export const useMeMutation = () => {
  return useMutation({
    mutationFn: async (username?: string) => getMe(username),
  });
};

export const useAccountById = (accountId: number) => {
  return useQuery({
    queryKey: ['account', accountId],
    queryFn: () => getAccountById(accountId),
  });
};

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });
};

export const useMessages = (companionId: number) => {
  return useSuspenseInfiniteQuery({
    queryKey: ['messages'],
    queryFn: ({ pageParam }) => {
      return getMessages(companionId, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < MESSAGES_PAGINATION_SIZE) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    refetchInterval: 1500,
  });
};

export const useCreateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { toId: number; content: string }) => createMessage(data.toId, data.content),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });
};
