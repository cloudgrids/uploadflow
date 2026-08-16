'use client';

import { SitePage } from '../components/site/SiteChrome';
import { EventConsole, TestSurfaces } from './components/TestSurfaces';
import { TestHero, TestMethodSidebar } from './components/TestChrome';
import { useInterceptorTests } from './useInterceptorTests';

export function InterceptorTestPage() {
  const test = useInterceptorTests();

  return (
    <SitePage>
      <TestHero passed={test.passed} results={test.latestResults} />
      <section className="uf-wrap uf-section">
        <div className="uf-test-split">
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
        </div>
      </section>
      <EventConsole logs={test.logs} onClear={test.clearLogs} />
    </SitePage>
  );
}
