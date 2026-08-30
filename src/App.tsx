import { useAppState } from './state/useAppState';
import { useDerived } from './state/useDerived';
import { Header } from './ui/Header';
import { BottomNav } from './ui/BottomNav';
import { Toast } from './ui/Toast';
import { AuthScreen } from './screens/AuthScreen';
import { ColorsScreen } from './screens/ColorsScreen';
import { BalanceScreen } from './screens/BalanceScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { NoteSheet } from './modals/NoteSheet';
import { EntrySheet } from './modals/EntrySheet';
import { DetailSheet } from './modals/DetailSheet';
import { FamilySheet } from './modals/FamilySheet';
import { FavoritesSheet } from './modals/FavoritesSheet';
import { ExtractSheet } from './modals/ExtractSheet';
import { AddUsageSheet } from './modals/AddUsageSheet';
import { EditProfileSheet } from './modals/EditProfileSheet';
import { ShareSheet } from './modals/ShareSheet';
import { PAPER_BG } from './ui/tokens';

export default function App() {
  const { state, actions, imgRef } = useAppState();
  const derived = useDerived(state);

  return (
    <div className="cb-shell" style={{ background: PAPER_BG, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="cb-card" style={{ background: '#FFFFFF', color: '#1C1B1A', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {!state.account ? (
          <AuthScreen state={state} actions={actions} />
        ) : derived.acc ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Header kicker={derived.header[0]} title={derived.header[1]} meta={derived.header[2]} />

            {state.screen === 'colors' && (
              <ColorsScreen state={state} derived={derived} actions={actions} imgRef={imgRef} />
            )}
            {state.screen === 'balance' && (
              <BalanceScreen state={state} derived={derived} actions={actions} />
            )}
            {state.screen === 'profile' && (
              <ProfileScreen derived={derived} actions={actions} />
            )}

            <BottomNav screen={state.screen} onNav={(s) => actions.patch({ screen: s })} />
          </div>
        ) : null}

        {derived.acc && (
          <>
            <NoteSheet state={state} previewHex={derived.previewHex} previewFamily={derived.previewFamily} actions={actions} />
            <FamilySheet state={state} derived={derived} actions={actions} />
            <FavoritesSheet state={state} derived={derived} actions={actions} />
            <ExtractSheet state={state} derived={derived} actions={actions} />
            <DetailSheet state={state} derived={derived} actions={actions} />
            <AddUsageSheet state={state} derived={derived} actions={actions} />
            <EntrySheet state={state} actions={actions} />
            <EditProfileSheet state={state} actions={actions} />
            <ShareSheet state={state} actions={actions} />
            <Toast flash={state.flash} />
          </>
        )}
      </div>
    </div>
  );
}
