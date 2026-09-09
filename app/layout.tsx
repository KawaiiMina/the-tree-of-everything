import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL('https://the-tree-of-everything.open-stork-5664.chatgpt.site'),title:'The Tree of Everything',description:'Grow existence itself—from the first spark in the Void to worlds, realities, and beyond infinity.',openGraph:{title:'The Tree of Everything',description:'From nothing, grow infinity.',type:'website',images:['/og.png']},twitter:{card:'summary_large_image',title:'The Tree of Everything',description:'From nothing, grow infinity.',images:['/og.png']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
