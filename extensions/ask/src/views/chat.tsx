import { Action, ActionPanel, clearSearchBar, Icon, List } from "@raycast/api";
import { Chat, ChatViewProps } from "../type";
import { AnswerDetailView } from "./answer-detail";
import { EmptyView } from "./empty";

export const ChatView = ({ data, use }: ChatViewProps) => {
  const sortedChats = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return sortedChats.length === 0 ? (
    <EmptyView />
  ) : (
    <List.Section title="Results" subtitle={data.length.toLocaleString()}>
      {sortedChats.map((sortedChat, i) => {
        return (
          <List.Item
            id={sortedChat.id}
            key={sortedChat.id}
            accessories={[{ text: `#${use.chats.data.length - i}` }]}
            title={sortedChat.question}
            detail={sortedChat && <AnswerDetailView chat={sortedChat} streamData={use.chats.streamData} />}
            actions={use.chats.isLoading ? undefined : undefined}
          />
        );
      })}
    </List.Section>
  );
};
