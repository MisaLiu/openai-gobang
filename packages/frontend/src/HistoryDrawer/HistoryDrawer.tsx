import HistoryList from './List';
import './style.css';

const HistoryDrawer = () => {
  return (
    <div class="drawer right">
      <h2>落子记录</h2>
      <HistoryList />
    </div>
  );
};

export default HistoryDrawer;
