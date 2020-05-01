import { Route, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './guards/auth.guard';
import { MemberDetailsComponent } from './members/member-list/member-details/member-details.component';
import { MemberDetailsResolver } from './_resolver/member-details.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberEditComponent } from './members/member-list/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PreventUnsaveChangesGuard } from './guards/Prevent.Unsave.changes.guard';
import { ListsResolver } from './_resolver/lists.resolver';

export const appRoute: Routes = [
    {path: '', component: HomeComponent},
    {
     path: '',
     runGuardsAndResolvers: 'always',
     canActivate: [AuthGuard],
     children: [
        {path: 'lists', component: ListsComponent, resolve: {users: ListsResolver}},
        {path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
        {path: 'members/:id', component: MemberDetailsComponent, resolve: {user: MemberDetailsResolver}},
        {path: 'member/edit', component: MemberEditComponent,
        resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsaveChangesGuard]},
        {path: 'message', component: MessagesComponent}
     ]
    },
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
