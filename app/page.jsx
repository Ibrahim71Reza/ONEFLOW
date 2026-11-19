'use client';
import {useRef, useEffect} from 'react';
import {mount} from '../src/interface.mjs';
export default function Page() {
  const root = useRef(null);
  useEffect(() => mount(root.current), []);
  return <div ref={root}><p>Opening ONEFLOW…</p></div>;
}
