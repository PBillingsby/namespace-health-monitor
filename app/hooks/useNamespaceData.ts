import { useReducer, useCallback } from 'react';
import { 
  NamespaceInfo, 
  NamespaceMessage, 
  RollupInfo, 
  HealthMetrics,
  HistoricalHealth
} from '../types/namespace';

interface NamespaceState {
  namespaceInfo: NamespaceInfo | null;
  namespaceMessages: NamespaceMessage[];
  rollupsInfo: RollupInfo[];
  healthScore: number;
  healthStatus: string;
  healthMetrics: HealthMetrics | null;
  historicalHealth: HistoricalHealth[];
  loading: boolean;
  loadingMoreMessages: boolean;
  error: string | null;
  totalMessages: number;
}

type NamespaceAction = 
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_MESSAGES_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null }
  | { type: 'SET_HEALTH_DATA', payload: { 
      info: NamespaceInfo; 
      score: number; 
      status: string; 
      metrics: HealthMetrics;
      timestamp: string;
    } 
  }
  | { type: 'SET_MESSAGES', payload: { messages: NamespaceMessage[], offset: number, limit: number } }
  | { type: 'SET_ROLLUPS', payload: RollupInfo[] }
  | { type: 'RESET_NAMESPACE_DATA' };

const initialState: NamespaceState = {
  namespaceInfo: null,
  namespaceMessages: [],
  rollupsInfo: [],
  healthScore: 0,
  healthStatus: '',
  healthMetrics: null,
  historicalHealth: [],
  loading: false,
  loadingMoreMessages: false,
  error: null,
  totalMessages: 0
};

function namespaceReducer(state: NamespaceState, action: NamespaceAction): NamespaceState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_MESSAGES_LOADING':
      return { ...state, loadingMoreMessages: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_HEALTH_DATA':
      return {
        ...state,
        namespaceInfo: action.payload.info,
        healthScore: action.payload.score,
        healthStatus: action.payload.status,
        healthMetrics: action.payload.metrics,
        historicalHealth: [
          ...state.historicalHealth,
          {
            timestamp: action.payload.timestamp,
            healthScore: action.payload.score,
            metrics: action.payload.metrics
          }
        ]
      };
    
    case 'SET_MESSAGES':
      const { messages, offset, limit } = action.payload;
      let totalMessages = state.totalMessages;
      
      if (messages.length < limit && offset === 0) {
        totalMessages = messages.length;
      } else if (messages.length < limit) {
        totalMessages = offset + messages.length;
      } else if (state.namespaceInfo?.pfb_count) {
        totalMessages = state.namespaceInfo.pfb_count;
      }
      
      return {
        ...state,
        namespaceMessages: messages,
        totalMessages
      };
    
    case 'SET_ROLLUPS':
      return { ...state, rollupsInfo: action.payload };
    
    case 'RESET_NAMESPACE_DATA':
      return {
        ...state,
        namespaceMessages: [],
        totalMessages: 0,
        error: null
      };
    
    default:
      return state;
  }
}

interface UseNamespaceDataReturn extends NamespaceState {
  checkNamespaceHealth: (id: string) => Promise<void>;
  fetchMoreMessages: (offset: number, limit: number) => Promise<void>;
}

export default function useNamespaceData(): UseNamespaceDataReturn {
  const [state, dispatch] = useReducer(namespaceReducer, initialState);

  const fetchMoreMessages = useCallback(async (offset: number, limit: number, namespaceId?: string) => {
    const id = namespaceId || state.namespaceInfo?.namespace_id;
    if (!id) return;
    
    dispatch({ type: 'SET_MESSAGES_LOADING', payload: true });
    
    try {
      const messagesResponse = await fetch(
        `/api/namespace/${id}/messages?offset=${offset}&limit=${limit}`
      );
      
      if (!messagesResponse.ok) {
        throw new Error(`Failed to fetch messages: ${messagesResponse.status}`);
      }
      
      const newMessages = await messagesResponse.json();
      
      dispatch({ 
        type: 'SET_MESSAGES', 
        payload: { 
          messages: newMessages, 
          offset, 
          limit 
        } 
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      dispatch({ type: 'SET_MESSAGES_LOADING', payload: false });
    }
  }, [state.namespaceInfo?.namespace_id]);

const checkNamespaceHealth = useCallback(async (id: string) => {
  if (!id) return;

  dispatch({ type: 'SET_LOADING', payload: true });
  dispatch({ type: 'RESET_NAMESPACE_DATA' });

  try {
    const healthResponse = await fetch(`/api/namespace/health/${id}`);
    if (!healthResponse.ok) {
      const errorData = await healthResponse.json();
      throw new Error(errorData.error || `Health check failed: ${healthResponse.status}`);
    }
    const healthData = await healthResponse.json();
    
    dispatch({ 
      type: 'SET_HEALTH_DATA', 
      payload: {
        info: healthData.namespaceInfo,
        score: healthData.healthScore,
        status: healthData.healthStatus,
        metrics: healthData.healthMetrics,
        timestamp: healthData.timestamp || new Date().toISOString()
      }
    });
    
    await fetchMoreMessages(0, 10, id);
    
    const rollupsResponse = await fetch(`/api/namespace/${id}/rollups`);
    if (rollupsResponse.ok) {
      const rollups = await rollupsResponse.json();
      dispatch({ type: 'SET_ROLLUPS', payload: rollups });
    } else {
      dispatch({ type: 'SET_ROLLUPS', payload: [] });
    }
    
    setTimeout(async () => {
      try {
        const secondHealthResponse = await fetch(`/api/namespace/health/${id}`);
        if (secondHealthResponse.ok) {
          const secondHealthData = await secondHealthResponse.json();
          dispatch({ 
            type: 'SET_HEALTH_DATA', 
            payload: {
              info: secondHealthData.namespaceInfo,
              score: secondHealthData.healthScore,
              status: secondHealthData.healthStatus,
              metrics: secondHealthData.healthMetrics,
              timestamp: secondHealthData.timestamp || new Date().toISOString()
            }
          });
        }
      } catch (err) {
        console.error("Error in second health check:", err);
      }
    }, 500);
    
  } catch (err) {
    console.error("Error checking namespace health:", err);
    dispatch({ 
      type: 'SET_ERROR', 
      payload: err instanceof Error ? err.message : String(err) 
    });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
}, [fetchMoreMessages]);

  return {
    ...state,
    checkNamespaceHealth,
    fetchMoreMessages
  };
}