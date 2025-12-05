export enum EditorStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GenerationState {
  status: EditorStatus;
  message: string;
}

export type ExportFormat = 'docx' | 'html';