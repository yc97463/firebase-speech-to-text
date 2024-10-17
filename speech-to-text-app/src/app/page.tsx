import SpeechToTextComponent from '../components/SpeechToTextComponent'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 font-sans">
      <h1 className="text-4xl font-bold mb-8">Speech to Text App</h1>
      <SpeechToTextComponent />
    </main>
  )
}