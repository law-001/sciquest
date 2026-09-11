import { supabase } from './supabase'

// Table: public.contact_messages — see supabase/migrations/20260911000000_contact_messages.sql.
// Anyone can insert; only admins can read, update, or delete.

const COLUMNS = 'id, name, email, message, user_id, is_read, created_at'

function toMessage(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    userId: row.user_id,
    isRead: row.is_read,
    createdAt: row.created_at,
  }
}

// No .select() after the insert: anonymous senders have no read policy, so
// asking for the new row back would fail even though the insert succeeded.
export async function submitContactMessage({ name, email, message, userId = null }) {
  const { error } = await supabase.from('contact_messages').insert({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    user_id: userId,
  })
  if (error) throw error
}

export async function listContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select(COLUMNS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toMessage)
}

export async function countUnreadContactMessages() {
  const { count, error } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false)
  if (error) throw error
  return count ?? 0
}

export async function setMessageRead(id, isRead) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: isRead })
    .eq('id', id)
  if (error) throw error
}

export async function deleteContactMessage(id) {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) throw error
}
