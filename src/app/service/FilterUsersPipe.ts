import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterUsers' })
export class FilterUsersPipe implements PipeTransform {
    transform(users: any[], searchText: string): any[] {
        if (!users) return [];
        if (!searchText) return users;

        searchText = searchText.toLowerCase();

        return users.filter(user => user.nom.toLowerCase().includes(searchText));
    }


}