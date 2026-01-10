import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSegments,
  fetchSegmentDetail,
  createSegment,
  updateSegment,
  deleteSegment,
  type SegmentCreateRequest,
} from "@/services/segmentApi";
import { toast } from "sonner";

export function useSegments() {
  return useQuery({
    queryKey: ["segments"],
    queryFn: fetchSegments,
  });
}

export function useSegmentDetail(id: string) {
  return useQuery({
    queryKey: ["segment", id],
    queryFn: () => fetchSegmentDetail(id),
    enabled: !!id,
  });
}

export function useCreateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      toast.success("Segment created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create segment: ${error.message}`);
    },
  });
}

export function useUpdateSegment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SegmentCreateRequest) => updateSegment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      queryClient.invalidateQueries({ queryKey: ["segment", id] });
      toast.success("Segment updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update segment: ${error.message}`);
    },
  });
}

export function useDeleteSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      toast.success("Segment deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete segment: ${error.message}`);
    },
  });
}
