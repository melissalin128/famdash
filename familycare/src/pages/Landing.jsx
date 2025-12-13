import { Button } from '@/components/ui';

export default function Landing() {
  return (
    <div style={{ padding: 40 }}>
      <h1>FamilyCare Landing Page</h1>
      <p>If you see this, React is rendering correctly!</p>
      <Button onClick={() => alert('Button works!')}>Test Button</Button>
    </div>
  );
}
