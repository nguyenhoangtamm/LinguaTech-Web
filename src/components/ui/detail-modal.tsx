"use client";

import React from 'react';
import { Modal, Button } from 'rsuite';
import { Eye } from 'lucide-react';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
}

export function DetailModal({ 
  open, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}: DetailModalProps) {
  return (
    <Modal open={open} onClose={onClose} size={size}>
      <Modal.Header>
        <Modal.Title className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

export function DetailField({ label, value, fullWidth = false }: DetailFieldProps) {
  return (
    <div className={`${fullWidth ? 'col-span-2' : ''} space-y-1`}>
      <dt className="text-sm font-medium text-gray-500">{label}:</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export function DetailSection({ 
  title, 
  children 
}: { 
  title?: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
          {title}
        </h3>
      )}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children}
      </dl>
    </div>
  );
}