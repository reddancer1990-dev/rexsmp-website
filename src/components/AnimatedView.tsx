import { type ReactNode } from 'react'

interface AnimatedViewProps {
  viewKey: string
  direction: 'forward' | 'back' | 'fade'
  className?: string
  children: ReactNode
}

export function AnimatedView({ viewKey, direction, className = '', children }: AnimatedViewProps) {
  return (
    <div key={viewKey} className={`animated-view anim-${direction} ${className}`.trim()}>
      {children}
    </div>
  )
}

interface AnimatedTitleProps {
  title: string
}

export function AnimatedTitle({ title }: AnimatedTitleProps) {
  return (
    <h1 key={title} className="top-title title-animate">
      {title}
    </h1>
  )
}
