import api from './api';

export interface Group {
  _id: string;
  name: string;
  description?: string;
  admin: any;
  members: any[];
  cart?: any;
  createdAt: string;
  updatedAt: string;
}

export const groupService = {
  async createGroup(data: { name: string; description?: string }): Promise<Group> {
    const response = await api.post('/groups', data);
    return response.data.group;
  },

  async getGroups(): Promise<Group[]> {
    const response = await api.get('/groups');
    return response.data.groups;
  },

  async getGroupById(id: string): Promise<Group> {
    const response = await api.get(`/groups/${id}`);
    return response.data.group;
  },

  async updateGroup(id: string, data: { name?: string; description?: string }): Promise<Group> {
    const response = await api.put(`/groups/${id}`, data);
    return response.data.group;
  },

  async deleteGroup(id: string): Promise<void> {
    await api.delete(`/groups/${id}`);
  },

  async addMember(groupId: string, email: string): Promise<Group> {
    const response = await api.post(`/groups/${groupId}/members`, { email });
    return response.data.group;
  },

  async removeMember(groupId: string, userId: string): Promise<Group> {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data.group;
  },
};
