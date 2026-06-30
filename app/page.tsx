import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-8 md:items-center md:py-16">
      <TodoApp />
    </main>
  );
}
