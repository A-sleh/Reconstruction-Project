import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, getConversations, getConversationById } from "./index";

export const useConversations = () =>
  useQuery({
    queryKey: QUERY_KEYS.conversations.lists(),
    queryFn: getConversations,
  });

export const useConversationById = (id: number) =>
  useQuery({
    queryKey: QUERY_KEYS.conversations.detail(id),
    queryFn: () => getConversationById(id),
    enabled: id != null,
  });