'use client';

import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MoreHorizontal, Truck } from 'lucide-react';
import { CRMLeadCard } from './CRMLeadCard';

interface CRMKanbanBoardProps {
    leads: any[];
    stages: any[];
    onDragEnd: (result: DropResult) => void;
    onLeadClick: (lead: any) => void;
    isOverdue: (date: string) => boolean;
    getDealHealth: (date: string) => any;
}

export function CRMKanbanBoard({
    leads,
    stages,
    onDragEnd,
    onLeadClick,
    isOverdue,
    getDealHealth
}: CRMKanbanBoardProps) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory">
                {stages.map((stage) => {
                    const stageLeads = leads.filter(l => (l.stage || 'new') === stage.value);
                    const totalValue = stageLeads.reduce((acc, l) => acc + (l.potentialValue || 0), 0);

                    return (
                        <div key={stage.value} className="min-w-[320px] max-w-[320px] flex flex-col h-full snap-center border-r border-dashed border-[#e9e2da]/60 last:border-0 pr-4">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4 px-1">
                                <div>
                                    <h3 className="font-serif text-[#2a1e16] font-medium text-lg flex items-center gap-2">
                                        {stage.label}
                                        <span className="text-[#8c7b70] text-xs opacity-60">({stageLeads.length})</span>
                                    </h3>
                                    <p className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-widest mt-0.5">
                                        ₹{totalValue.toLocaleString('en-IN', { notation: 'compact' })}
                                    </p>
                                </div>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={stage.value}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 space-y-3 min-h-[150px] transition-colors rounded-2xl p-1 ${snapshot.isDraggingOver ? 'bg-[#e9e2da]/30' : ''
                                            }`}
                                    >
                                        {stageLeads.map((lead, index) => (
                                            <Draggable key={lead._id} draggableId={lead._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            opacity: snapshot.isDragging ? 0.9 : 1
                                                        }}
                                                    >
                                                        {/* Simplified Card for Kanban */}
                                                        <div
                                                            onClick={() => onLeadClick(lead)}
                                                            className="bg-white p-5 rounded-xl border border-[#e9e2da] shadow-sm hover:shadow-lg hover:border-[#b45a3c]/30 cursor-grab active:cursor-grabbing group transition-all"
                                                        >
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h4 className="font-serif text-[#2a1e16] font-medium text-base truncate pr-2">{lead.clientName}</h4>
                                                                {lead.potentialValue > 0 && (
                                                                    <span className="text-[10px] font-bold text-[#2a1e16]">
                                                                        ₹{(lead.potentialValue / 1000).toFixed(0)}k
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[11px] text-[#8c7b70] truncate max-w-[150px]">
                                                                    {lead.company || 'Private Client'}
                                                                </p>
                                                                {isOverdue(lead.nextFollowUp) && lead.stage !== 'won' && (
                                                                    <div className="w-2 h-2 rounded-full bg-rose-500" title="Action Pending" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}
