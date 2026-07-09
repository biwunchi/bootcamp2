// 루트에서 피드로 리디렉션
import { redirect } from 'next/navigation';
export default function Home() {
  redirect('/feed');
  return null;
}
