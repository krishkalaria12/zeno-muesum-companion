'use client'

import { Button } from '@/components/ui/button'
import Textarea from 'react-textarea-autosize'
import { StopCircle } from 'lucide-react'

export function PromptForm({
  input,
  handleInputChange,
  handleSubmit,
  setInput,
  isLoading,
  stop
}: any) {

  return (
    <div className='max-w-[750px] w-full relative'>
      <form onSubmit={handleSubmit} className='w-full absolute bottom-3 left-0'>
        <div className="flex justify-center items-center max-h-60 w-full grow overflow-hidden bg-background pr-2 pl-2 rounded-md border">
          <Textarea
            placeholder="Ask a museum-related query or book tickets..."
            className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            onChange={handleInputChange}
            value={input}
            rows={1}
          />
          <div className='flex gap-1'>
            {isLoading ? <Button onClick={stop} size="icon" disabled={!isLoading}><StopCircle /></Button> : <Button type="submit" size="icon" variant="outline">Send</Button>}
          </div>
        </div>
      </form>
    </div>
  )
}
