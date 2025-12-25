'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import '@/sanity/studio.css'

export default function StudioView() {
    return <NextStudio config={config} />
}
