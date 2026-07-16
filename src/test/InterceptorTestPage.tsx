'use client';

import { EventConsole, TestSurfaces } from './components/TestSurfaces';
import { TestHeader, TestHero, TestMethodSidebar } from './components/TestChrome';
import { useInterceptorTests } from './useInterceptorTests';

export function InterceptorTestPage() {
  const test = useInterceptorTests();

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#0b0d0f] text-white selection:bg-[#eefb7a] selection:text-[#0b0d0f]">
      <TestHeader />
      <main>
        <TestHero passed={test.passed} results={test.latestResults} />
        <section className="mx-auto grid w-full max-w-360 gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[220px_1fr] lg:px-12">
          <TestMethodSidebar results={test.latestResults} />
          <TestSurfaces
            fileHandleName={test.fileHandle?.name}
            networkFile={test.networkFile}
            addLog={test.addLog}
            setNetworkFile={test.setNetworkFile}
            chooseWithFilePicker={test.chooseWithFilePicker}
            readFileHandle={test.readFileHandle}
            readClipboard={test.readClipboard}
            sendWithFetch={test.sendWithFetch}
            sendWithXhr={test.sendWithXhr}
          />
        </section>
        <EventConsole logs={test.logs} onClear={test.clearLogs} />
      </main>
    </div>
  );
}
