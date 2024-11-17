export type Account = {
  id: number;
  username: string;
  latestMessage?: null | Message;
};

export type Message = {
  id: string;
  from_id: number;
  to_id: number;
  content: string;
  sent_at: string;
};
