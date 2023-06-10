export const H2 = ({ text }: { text: string }) => {
   return (
      <>
         <h2
            className="border-color shadow-1 relative mb-2.5 mt-8 overflow-hidden 
         rounded-lg border-2 px-4 py-3 text-xl shadow-sm"
         >
            <div
               className="pattern-dots absolute left-0
                   top-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
            ></div>
            <div
               className="absolute left-0 top-0 h-full w-full 
            bg-gradient-to-r from-yellow-50/50 dark:from-yellow-500/5"
            ></div>

            <span className="relative z-10">{text}</span>
         </h2>
      </>
   );
};
