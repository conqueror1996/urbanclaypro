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
                        <div key={stage.value} className="min-w-[320px] max-w-[320px] bg-[#e9e2da]/20 rounded-3xl p-4 flex flex-col h-full snap-center">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div>
                                    <h3 className="font-serif text-[#2a1e16] font-medium text-lg flex items-center gap-2">
                                        {stage.label}
                                        <span className="bg-[#e9e2da] text-[#8c7b70] text-[10px] font-bold px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                                    </h3>
                                    <p className="text-[10px] font-bold text-[#8c7b70] uppercase tracking-widest mt-1">
                                        ₹{totalValue.toLocaleString('en-IN')} Vol.
                                    </p>
                                </div>
                                <button className="text-[#8c7b70] hover:text-[#2a1e16]">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
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
                                                            className="bg-white p-4 rounded-2xl border border-[#e9e2da]/60 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing group relative overflow-hidden"
                                                        >
                                                            <div className={`absolute top-0 left-0 bottom-0 w-1 ${stage.color.split(' ')[0]}`} />

                                                            <div className="flex items-start justify-between mb-3 pl-2">
                                                                <div>
                                                                    <h4 className="font-serif text-[#2a1e16] text-sm leading-tight">{lead.clientName}</h4>
                                                                    <p className="text-[9px] font-bold text-[#8c7b70] uppercase tracking-wider mt-0.5 flex items-center gap-1">
                                                                        {lead.company || 'Direct'}
                                                                        {lead.location && <span className="text-[#b45a3c] font-black"> &bull; {lead.location}</span>}
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-1">
                                                                    {lead.potentialValue > 0 && (
                                                                        <span className="text-[9px] font-bold text-[#2a1e16] bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#e9e2da]">
                                                                            ₹{(lead.potentialValue / 1000).toFixed(0)}k
                                                                        </span>
                                                                    )}
                                                                    {lead.freightEstimate > 0 && (
                                                                        <span className="text-[8px] font-bold text-orange-600 bg-orange-50 px-1 py-0.5 rounded flex items-center gap-1">
                                                                            <Truck className="w-2 h-2" />
                                                                            ₹{(lead.freightEstimate / 1000).toFixed(0)}k
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between pl-2">
                                                                <div className="flex -space-x-1.5">
                                                                    <div className="w-5 h-5 rounded-full bg-[#2a1e16] text-white flex items-center justify-center text-[8px] font-bold border border-white">
                                                                        {lead.clientName?.charAt(0)}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {lead.leadDate && (
                                                                        <span className="text-[8px] font-bold text-gray-400">{new Date(lead.leadDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                                    )}
                                                                    {isOverdue(lead.nextFollowUp) && lead.stage !== 'won' && (
                                                                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Action Pending" />
                                                                    )}
                                                                </div>
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
