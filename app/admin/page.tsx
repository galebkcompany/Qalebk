// app/admin/page.tsx
import { redirect } from 'next/navigation'

export default async function AdminHome() {
  redirect('/admin/dashboard')
}
